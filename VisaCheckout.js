window.Lowes = window.Lowes || {};
window.Lowes.Checkout = window.Lowes.Checkout || {};
window.Lowes.Checkout.Visa = window.Lowes.Checkout.Visa || {};

// Function for Visa Checkout
function onVisaCheckoutReady() {
	V.init({
		apikey : "62FNBTE75M8XYVRAEYDN13e-7EXsQBP_OrWz00aSp-6R1NG88",
		paymentRequest : {
			currencyCode : "USD",
			total : $('#remaining-balance').html().replace('$','')
		}
	});
	V.on("payment.success", function(payment) {
		// Parse Values and pass them to hidden fields...
		alert(payment.encKey);
		alert(payment.encPaymentData);
		Lowes.Checkout.Visa.addHiddenFields(payment.encKey, payment.encPaymentData);
		Lowes.Checkout.Visa.loadVisaSuccess();

	});
	V.on("payment.cancel", function(payment) {
		// Do nothing here .... The user canceled... 
	});
	V.on("payment.error", function(payment, error) {
		alert(JSON.stringify(error));
	});
}

// Custom JS to hack up the payment page for Visa Checkout :) 
(function($){

	Lowes.Checkout.Visa = {

		pathName: window.location.pathname,
		
		init: function(){
			// -----
			Lowes.Checkout.Visa.setupHtml();
		},

		setupHtml: function(){
			// ----- Inject the HTML into the payment page
			var htmlContent;
			// Add the initial tab
			$('#cc-block').find('ul').append('<li class="ui-state-default ui-corner-top"><a id="doVisa" href="#"><img src="https://www.underconsideration.com/brandnew/archives/visa_2014_logo_detail.png" style="width:35px; padding-right:10px;" />Checkout</a></li>');
			// Add the visa checkout content container
			htmlContent = '<div id="visa-co" class="ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide"><div class="js-visaInfo">';
			// Add the visa checkout Description
			htmlContent = htmlContent + 'Visa Checkout provides a single sign-in service to pay for online shopping purchases. After a simple setup, Visa Checkout users can skip inputting their payment and shipping information for their orders. Whether at home or on the go, Visa Checkout works across multiple devices so online shopping stays easy. Visa Checkout enables shoppers to choose their preferred payment method across multiple retailers with a click of a button.';
			// Add the visa checkout button...
			htmlContent = htmlContent + '<br><br><strong>Use the button below to checkout using visa checkout.</strong><br><br><img alt="Visa Checkout" class="v-button" style="width:40%;" role="button" src="https://sandbox.secure.checkout.visa.com/wallet-services-web/xo/button.png" /></div><br><br><a role="button" class="v-button js-edit-cc-card display-none" href="#">Click Here to Edit Your Card</a></div>';
			// Edit card after successful submission - hidden by default...
			
			$('.tab_content').append(htmlContent);

			// Setup bindings
			Lowes.Checkout.Visa.setupBindings();
		},

		setupBindings: function(){
			// -----
			// Cached Selectors
				$visaCo = $('#visa-co'),
				$CCBlockListItem = $('#cc-block .ui-tabs-nav li'),
				$visaBlock = $('#doVisa'),
				$widgetHeader = $('.ui-widget-header'),
				$ccAdd = $('#ccAddTab'),
				$ccSelect = $('#ccSelectTab');
				
			// Hide other panels and show the visa checkout tab
			$visaBlock.click(function(event) {
				$CCBlockListItem.removeClass('ui-tabs-selected ui-state-active');
				$visaBlock.parent().addClass('ui-tabs-selected ui-state-active');
				$('#cc-block').find('*.ui-tabs-panel').removeClass('ui-tabs-hide').addClass('ui-tabs-hide');
				$visaCo.removeClass('ui-tabs-hide');
				$widgetHeader.css('height','44px');
			});
			// Appending extra bindings to existing buttons... 
			$ccAdd.click(function(event) {
				$CCBlockListItem.removeClass('ui-tabs-selected ui-state-active');
				$visaCo.removeClass('ui-tabs-hide').addClass('ui-tabs-hide');
				$widgetHeader.css('height','auto');
				$ccAdd.parent().addClass('ui-tabs-selected ui-state-active');
			});
			// Appending extra bindings to existing buttons... 
			$ccSelect.click(function(event) {
				$CCBlockListItem.removeClass('ui-tabs-selected ui-state-active');
				$visaCo.removeClass('ui-tabs-hide').addClass('ui-tabs-hide');
				$widgetHeader.css('height','auto');
				$ccSelect.parent().addClass('ui-tabs-selected ui-state-active');
			});

			// Finally - load in the Visa checkout scripts...
			Lowes.Checkout.Visa.loadInVisaCheckout();

		},

		addHiddenFields: function(encKey, encPaymentData){
			// -----
			// Adds hidden form fields and their values.... 
			$('.js-visa-hidden-fields').remove();
			$('#CreditcardForm').append('<input type="hidden" class="js-visa-hidden-fields" name="encKey" value="'+encKey+'"><input type="hidden" class="js-visa-hidden-fields" name="encPaymentData" value="'+encPaymentData+'">');
			
		},

		loadVisaSuccess: function() {
			// -----
			// Show the user it was successful!
			var htmlContent;

			htmlContent = 'The remaining balance of <strong>'+ $('#remaining-balance').html() + '</strong> will be applied to your visa card.<br><br>';
			htmlContent = htmlContent + '<img src="https://www.underconsideration.com/brandnew/archives/visa_2014_logo_detail.png" style="width:35px; padding-right:10px;" />x1242<br><strong>Expires:</strong> 11/21';

			$('.js-visaInfo').html(htmlContent);
			// Show button to re-activate the Visa Modal
			$('.js-edit-cc-card').removeClass('display-none');

		},

		loadInVisaCheckout: function() {
			// -----
			// Visa Checkout code....
			$('body').append('<script type="text/javascript" src="https://sandbox-assets.secure.checkout.visa.com/checkout-widget/resources/js/integration/v1/sdk.js"></script>');
		}
	}


}(jQuery));
// -----
// Only run when on Checkout page...
if((Lowes.Checkout.Visa.pathName.indexOf('OrderDisplayPendingView') != -1) || (Lowes.Checkout.Visa.pathName.indexOf('OrderProcess') != -1)){
	Lowes.Checkout.Visa.init();
}