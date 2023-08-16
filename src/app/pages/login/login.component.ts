import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Notifications } from 'src/app/helpers/notifications';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    passwordMinLength: number = 8;
    passwordAllowedSymbols: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    hidePassword: boolean = true;
    errorMessage: string;

    emailRequiredErrorMessage: string = 'Необходимо ввести Email';
	emailInvalidErrorMessage: string = 'Некорректный Email';
	passwordRequiredErrorMessage: string = 'Необходимо ввести пароль';
	passwordMinLengthErrorMessage: string = `Пароль должен иметь не менее ${this.passwordMinLength} символов`;
	passwordInvalidErrorMessage: string = 'Пароль должен иметь минимум 1 цифру, символ и по 1 заглавной и строчной букве';

    loginForm: FormGroup = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(this.passwordMinLength), Validators.pattern(this.passwordAllowedSymbols)]),
    });

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private notifications: Notifications 
    ) {}

    submitLogin() {
        if (this.loginForm.invalid) {
            this.notifications.showNotification('Корректно заполните поля формы!', 'error');
            return;
        }

        this.router.navigate(['../posts'], { relativeTo: this.route });
    }
}
