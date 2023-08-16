import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import CustomValidators from '../../helpers/custom-validators'
import { ApiService } from 'src/app/services/api.service';
import { Notifications } from 'src/app/helpers/notifications';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent {
	firstNameMaxLength: number = 20;
	lastNameMaxLength: number = 30;
	namesAllowedSymbols: RegExp = /^[A-Za-zа-яА-ЯЁё]+(?:[ _-][A-Za-zа-яА-ЯЁё]+)*$/;
	passwordMinLength: number = 8;
	passwordAllowedSymbols: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
	hidePassword: boolean = true;
	hideConfirmPassword: boolean = true;
	maxBirthDate: Date;
	minAgeAllowed: number = 18;
	errorMessage: string;
	
	firstNameRequiredErrorMessage: string = 'Необходимо ввести Имя';
	firstNameMaxLengthErrorMessage: string = `Имя не должно быть длиннее ${this.firstNameMaxLength} символов`;
	namesAllowedSymbolsErrorMessage: string = 'Допустимы только буквы, а также разделители из 1 пробела, либо дефиса';
	lastNameRequiredErrorMessage: string = 'Необходимо ввести Фамилию';
	lastNameMaxLengthErrorMessage: string = `Фамилия не должна быть длиннее ${this.lastNameMaxLength} символов`;
	emailRequiredErrorMessage: string = 'Необходимо ввести Email';
	emailInvalidErrorMessage: string = 'Некорректный Email';
	passwordRequiredErrorMessage: string = 'Необходимо ввести пароль';
	passwordMinLengthErrorMessage: string = `Пароль должен иметь не менее ${this.passwordMinLength} символов`;
	passwordInvalidErrorMessage: string = 'Пароль должен иметь минимум 1 цифру, символ и по 1 заглавной и строчной букве';
	confirmPasswordRequiredErrorMessage: string = 'Необходимо подтвердить пароль';
	confirmPasswordNotMatchErrorMessage: string = 'Пароли не совпадают';
	birthDateRequiredErrorMessage: string = 'Необходимо выбрать дату рождения';
	birthDateNotAllowedErrorMessage: string = `Вам должно быть не менее ${this.minAgeAllowed} лет `;

	registerForm: FormGroup = new FormGroup({
		firstName: new FormControl('', [Validators.required, Validators.maxLength(this.firstNameMaxLength), Validators.pattern(this.namesAllowedSymbols)]),
		lastName: new FormControl('', [Validators.required, Validators.maxLength(this.lastNameMaxLength), Validators.pattern(this.namesAllowedSymbols)]),
		email: new FormControl('', [Validators.required, Validators.email]),
		password: new FormControl('', [Validators.required, Validators.minLength(this.passwordMinLength), Validators.pattern(this.passwordAllowedSymbols)]),
		confirmPassword: new FormControl('', Validators.required),
		birthDate: new FormControl('', Validators.required)
	}, 
	{
		validators: [CustomValidators.match('password', 'confirmPassword')]
	}
	);

	constructor(
		private apiService: ApiService,
		private router: Router,
		private route: ActivatedRoute,
		private notifications: Notifications
	) {}

	ngOnInit() {
		const today = new Date();
		this.maxBirthDate = new Date(
			today.getFullYear() - this.minAgeAllowed,
			today.getMonth(),
			today.getDate()
    	);
	}

	submitRegister() {
		if (this.registerForm.invalid) {
            this.notifications.showNotification('Корректно заполните поля формы!', 'error');
            return;
        }
		
		const userData = Object.assign(this.registerForm.value, {
			firstName: this.registerForm.value.firstName,
			lastName: this.registerForm.value.lastName,
			email: this.registerForm.value.email,
			password: this.registerForm.value.password,
			confirmPassword: this.registerForm.value.confirmPassword,
			birthDate: this.registerForm.value.birthDate
		});

		this.apiService.registerUser(userData).subscribe({
			next: (data) => {
				this.router.navigate(['../login'], { relativeTo: this.route });
				this.notifications.showNotification(`${data.firstName}, Вы успешно зарегистрировались!`, 'success');
			},
			error: error => {
				this.errorMessage = error.message;
				this.notifications.showNotification(this.errorMessage, 'error');
			}
		});
	}
}
