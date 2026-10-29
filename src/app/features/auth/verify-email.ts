import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { authErrorMessage, AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-verify-email',
  imports: [RouterLink, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './auth-card.css',
  template: `
    <section class="card" aria-labelledby="verify-title">
      <h1 id="verify-title">Check your email</h1>
      <p class="lead">
        We've sent a verification link to {{ auth.user()?.email || 'your email address' }}. Open it, then log in again.
      </p>

      @if (error()) {
        <p class="error" role="alert">{{ error() }}</p>
      }
      @if (resent()) {
        <p class="success" role="status">A new verification link has been sent.</p>
      }

      <div class="actions">
        @if (auth.user()) {
          <button mat-stroked-button type="button" (click)="resend()" [disabled]="busy()">Resend the link</button>
        }
        <a mat-flat-button routerLink="/login">Go to log in</a>
      </div>
    </section>
  `,
})
export class VerifyEmail {
  protected readonly auth = inject(AuthService);
  protected readonly busy = signal(false);
  protected readonly resent = signal(false);
  protected readonly error = signal('');

  protected async resend(): Promise<void> {
    this.busy.set(true);
    this.error.set('');
    try {
      await this.auth.resendVerification();
      this.resent.set(true);
    } catch (e) {
      this.error.set(authErrorMessage(e));
    } finally {
      this.busy.set(false);
    }
  }
}
