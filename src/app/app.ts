import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-toolbar class="bar">
      <a class="brand" routerLink="/">
        <mat-icon aria-hidden="true">directions_car</mat-icon>
        Stock Management
      </a>
      <span class="spacer"></span>
      @if (auth.signedIn()) {
        <span class="who">{{ auth.user()?.email }}</span>
        <button mat-button type="button" (click)="auth.logout()">
          <mat-icon>logout</mat-icon>
          Log out
        </button>
      }
    </mat-toolbar>

    <main class="content">
      <router-outlet />
    </main>

    <footer class="foot">
      <span>Stock Management · a demo project by Phillip Marais</span>
      <span class="links">
        <a href="https://github.com/PhillipMarais/Stock-Management-App">Source on GitHub</a>
        <a href="https://phillipmarais.github.io/">Portfolio</a>
      </span>
    </footer>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .bar {
      position: sticky;
      top: 0;
      z-index: 10;
      gap: 0.5rem;
      color: #fff;
      background: #1f2933;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: inherit;
      text-decoration: none;
      font-weight: 600;
    }
    .spacer {
      flex: 1;
    }
    .who {
      font-size: 0.9rem;
      opacity: 0.8;
    }
    .bar button {
      color: #fff;
    }
    .content {
      flex: 1;
      width: 100%;
      max-width: 72rem;
      margin: 0 auto;
      padding: 1.5rem 1rem 3rem;
    }
    .foot {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 0.5rem 1.5rem;
      padding: 1rem 1.5rem;
      font-size: 0.85rem;
      color: #52606d;
      border-top: 1px solid #e4e7eb;
    }
    .links {
      display: flex;
      gap: 1rem;
    }
    @media (max-width: 600px) {
      .who {
        display: none;
      }
    }
  `,
})
export class App {
  protected readonly auth = inject(AuthService);
}
