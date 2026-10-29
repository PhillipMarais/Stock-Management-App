import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { authErrorMessage, AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './auth-card.css',
  template: `
    <section class="card" aria-labelledby="reset-title">
      <h1 id="reset-title">Reset your password</h1>
      <p class="lead">Enter your email and we'll send you a reset link.</p>

      @if (error()) {
        <p class="error" role="alert">{{ error() }}</p>
      }
      @if (sent()) {
        <p class="success" role="status">If an account exists for that email, a reset link is on its way.</p>
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
        <div class="actions">
          <button mat-flat-button type="submit" [disabled]="busy()">Send reset link</button>
        </div>
      </form>

      <p class="links">
        <a routerLink="/login">Back to log in</a>
      </p>
    </section>
  `,
})
export class ForgotPassword {
  private readonly auth = inject(AuthService);
  protected readonly form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });
  protected readonly busy = signal(false);
  protected readonly sent = signal(false);
  protected readonly error = signal('');

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    this.error.set('');
    try {
      await this.auth.resetPassword(this.form.value.email!);
      this.sent.set(true);
    } catch (e) {
      this.error.set(authErrorMessage(e));
    } finally {
      this.busy.set(false);
    }
  }
}
