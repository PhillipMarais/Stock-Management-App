import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { authErrorMessage, AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './auth-card.css',
  template: `
    <section class="card" aria-labelledby="login-title">
      <h1 id="login-title">Log in</h1>
      <p class="lead">Manage your vehicle stock.</p>

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
          <input matInput type="password" formControlName="password" autocomplete="current-password" />
          @if (form.controls.password.hasError('required')) {
            <mat-error>Enter your password.</mat-error>
          }
        </mat-form-field>
        <div class="actions">
          <button mat-flat-button type="submit" [disabled]="busy()">Log in</button>
          <p class="divider">or</p>
          <button mat-stroked-button class="google" type="button" (click)="google()" [disabled]="busy()">
            <img src="images/google-icon.png" alt="" />Sign in with Google
          </button>
        </div>
      </form>

      <p class="links">
        <a routerLink="/register">Create an account</a>
        <a routerLink="/forgot-password">Forgot password?</a>
      </p>
    </section>
  `,
})
export class Login {
  private readonly auth = inject(AuthService);
  protected readonly form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  protected readonly busy = signal(false);
  protected readonly error = signal('');

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    await this.run(() => this.auth.login(this.form.value.email!, this.form.value.password!));
  }

  protected google(): Promise<void> {
    return this.run(() => this.auth.loginWithGoogle());
  }

  private async run(action: () => Promise<void>): Promise<void> {
    this.busy.set(true);
    this.error.set('');
    try {
      await action();
    } catch (e) {
      this.error.set(authErrorMessage(e));
    } finally {
      this.busy.set(false);
    }
  }
}
