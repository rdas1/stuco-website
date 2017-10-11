(function() {
	//Initialize Firebase
	const config = {
		apiKey: "AIzaSyDBU-z8Kom3zbW1-wWAR9uRHxTGC3j2zw8",
		authDomain: "student-council-website.firebaseapp.com",
		databaseURL: "https://student-council-website.firebaseio.com",
		storageBucket: "student-council-website.appspot.com",
	};

	firebase.initializeApp(config);
	var rootRef = firebase.database().ref();
	var accMade = false;
	var emailVer = "";
	var state = -1;
	
	// Get elements
	const txtEmail = document.getElementById('txtEmail');
	const txtPassword = document.getElementById('txtPassword');
	const btnEnter = document.getElementById('btnEnter');
	const btnLogin = document.getElementById('btnLogin');
	const btnSignUp = document.getElementById('btnSignUp');
	const btnLogout = document.getElementById('btnLogout');


	//Add Login event
	btnLogin.addEventListener('click', e => {
		txtEmail.type = 'type';
		txtPassword.type = 'password';
		state = 1;

	});
	btnEnter.addEventListener('click', e =>{
		if(state==1){
			const email = txtEmail.value;
			const pass = txtPassword.value;
			firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// [START_EXCLUDE]
			if (errorCode === 'auth/wrong-password') {
				alert('Wrong Email / Password. Account may not be verified');
			} else {
				alert(errorMessage);
			}
			console.log(error);
			// [END_EXCLUDE]
			});
			//ADD REDIRECT
			if(firebase.auth().currentUser){
				btnLogin.classList.add('hide');
			}
		}
		if(state==2){
			var email = txtEmail.value;
			var pass = "";
		
			if(email.substring(email.indexOf('@'))!="@exeter.edu"){
				alert("Please enter an @exeter.edu email");
			}
			else{
				const possibleChars = ['abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?_-'];
				pass = "";
				for(var i = 0; i < 16; i++){
					pass += possibleChars[Math.floor(Math.random() * possibleChars.length)];
				}
				firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				// [START_EXCLUDE]
				if (errorCode == 'auth/weak-password') {
					alert('The password is too weak. ADD REQUIREMENTS');
				} else {
					alert(errorMessage);
				}
				console.log(error);
				// [END_EXCLUDE]
				});
				accMade=true;
				emailVer = email;
			}
		}
	});
	
	//Add singup event
	btnSignUp.addEventListener('click', e => {
		txtEmail.type = 'type';
		txtPassword.type = 'hidden';
		state=2;
	});
	
	btnLogout.addEventListener('click', e => {
		firebase.auth().signOut();
		console.log(firebase.auth.currentUser);
	});
	
	//Add a realtime listener
	setInterval(function(){
		if(accMade==true){
			accMade=false;
			firebase.auth().signOut();
			firebase.auth().sendPasswordResetEmail(emailVer).then(function() {
				// Password Reset Email Sent!
				// [START_EXCLUDE]
				alert('Verification Email Sent');
				// [END_EXCLUDE]
			}).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// [START_EXCLUDE]
			if (errorCode == 'auth/invalid-email') {
				alert(errorMessage);
			} else if (errorCode == 'auth/user-not-found') {
				alert(errorMessage);
			}
        console.log(error);
        // [END_EXCLUDE]
			});
		}
		if(firebase.auth().currentUser){
			btnLogout.class = "btn btn-action";
			btnSignUp.class = "btn btn-hide";
			btnLogin.class = "btn btn-hide";
			btnEnter.class = "btn btn-hide";
		}
		else{
			btnLogout.class = "btn btn-hide";
			btnSignUp.class = "btn btn-action";
			btnLogin.class = "btn btn-action";
		}
	}, 1000);
	
	firebase.auth().onAuthStateChanged(firebaseUser => {
		if(firebaseUser) {
			console.log(firebaseUser);
			btnLogout.classList.remove('hide');
			btnSignUp.classList.add('hide');
			btnLogin.classList.add('hide');
		} else {
			console.log('not logged in');
			btnLogout.classList.add('hide');
			btnSignup.classList.remove('hide');
			btnLogin.classList.remove('hide');
		}
	});
}());