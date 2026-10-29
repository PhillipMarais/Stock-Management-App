import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { authErrorMessage, AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './auth-card.css',
  template: `
    <section class="card" aria-labelledby="register-title">
      <h1 id="register-title">Create an account</h1>
      <p class="lead">We'll send you a link to verify your email.</p>

      @if (error()) {
        <p class="error" role="alert">{{ error() }}</p>
      }

      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" autocomplete="email" />
          @if (form.controls.email.hasError('required')) {
            <mat-error>Enter your email.</mat-error>
          } @else if (form.controls.email.hasError('email')) {
            <mat-error>Enter a valid email address.</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" autocomplete="new-password" />
          <mat-hint>At least 6 characters</mat-hint>
          @if (form.controls.password.hasError('required')) {
            <mat-error>Choose a password.</mat-error>
          } @else if (form.controls.password.hasError('minlength')) {
            <mat-error>Use at least 6 characters.</mat-error>
          }
        </mat-form-field>
        <div class="actions">
          <button mat-flat-button type="submit" [disabled]="busy()">Create account</button>
        </div>
      </form>

      <p class="links">
        <a routerLink="/login">I already have an account</a>
      </p>
    </section>
  `,
})
export class Register {
  private readonly auth = inject(AuthService);
  protected readonly form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  protected readonly busy = signal(false);
  protected readonly error = signal('');

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    this.error.set('');
    try {
      await this.auth.register(this.form.value.email!, this.form.value.password!);
    } catch (e) {
      this.error.set(authErrorMessage(e));
    } finally {
      this.busy.set(false);
    }
  }
}
