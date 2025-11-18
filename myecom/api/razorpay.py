import frappe
import razorpay
from razorpay.errors import SignatureVerificationError

class RazorpayIntegration:
    def __init__(self):
        """Initialize Razorpay client with credentials from site config"""
        key_id = frappe.conf.get('razorpay_key_id')
        key_secret = frappe.conf.get('razorpay_key_secret')

        if not key_id or not key_secret:
            frappe.throw("Razorpay credentials not configured")

        self.client = razorpay.Client(auth=(key_id, key_secret))
        self.key_id = key_id

@frappe.whitelist(allow_guest=True)
def create_order(sales_order_id, amount, currency="INR"):
    """Create Razorpay order with validation"""
    try:
        # Validate sales order exists
        if not frappe.db.exists("Sales Order", sales_order_id):
            frappe.throw("Sales Order not found")

        # Get and validate order amount (prevent tampering)
        sales_order = frappe.get_doc("Sales Order", sales_order_id)
        order_amount = float(sales_order.total_amount)

        if abs(order_amount - float(amount)) > 0.01:
            frappe.throw("Amount mismatch detected")

        # Convert to paise (multiply by 100) as required by Razorpay
        amount_in_paise = int(order_amount * 100)

        integration = RazorpayIntegration()

        order_data = {
            'amount': amount_in_paise,
            'currency': currency,
            'receipt': sales_order_id,
            'payment_capture': '1'  # Auto-capture in test mode
        }

        order = integration.client.order.create(data=order_data)

        return {
            'order_id': order['id'],
            'amount': order['amount'],  # In paise
            'currency': order['currency'],
            'key_id': integration.key_id,
            'status': 'created',
            'sales_order_id': sales_order_id  # Include for frontend reference
        }

    except Exception as e:
        frappe.log_error(f"Razorpay Order Creation Failed: {str(e)}")
        frappe.throw("Payment initialization failed")

@frappe.whitelist(allow_guest=True)
def verify_payment(razorpay_payment_id, razorpay_order_id, razorpay_signature, sales_order_id):
    """Verify payment signature and create payment record"""
    try:
        # Get integration instance for signature verification
        integration = RazorpayIntegration()

        # Verify signature using Razorpay SDK method
        integration.client.utility.verify_payment_signature({
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        })

        # Fetch payment details to confirm status
        payment = integration.client.payment.fetch(razorpay_payment_id)

        if payment.get('status') != 'captured':
            frappe.throw("Payment not captured")

        # Verify amount matches order (additional security check)
        sales_order = frappe.get_doc("Sales Order", sales_order_id)
        payment_amount_in_rupees = float(payment['amount']) / 100

        if abs(float(sales_order.total_amount) - payment_amount_in_rupees) > 0.01:
            frappe.throw("Payment amount verification failed")

        # Create payment record using existing payment API
        payment_result = frappe.call(
            'myecom.api.payment.create_payment',
            sales_order_id=sales_order_id,
            payment_method='Razorpay',
            transaction_id=razorpay_payment_id,
            status='Completed'
        )

        return {
            'status': 'success',
            'message': 'Payment verified and recorded',
            'payment_id': payment_result.get('payment_id'),
            'sales_order_status': 'Paid'
        }

    except SignatureVerificationError:
        frappe.throw("Payment signature verification failed - invalid signature")
    except Exception as e:
        frappe.log_error(f"Razorpay Payment Verification Failed: {str(e)}")
        frappe.throw("Payment verification failed")

@frappe.whitelist()
def get_payment_details(payment_id):
    """Get payment details for debugging (test mode only)"""
    try:
        integration = RazorpayIntegration()
        payment = integration.client.payment.fetch(payment_id)
        return payment
    except Exception as e:
        frappe.log_error(f"Payment Details Fetch Failed: {str(e)}")
        frappe.throw("Failed to fetch payment details")
