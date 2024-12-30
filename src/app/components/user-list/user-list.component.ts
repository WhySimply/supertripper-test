import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, UserModalComponent],
  template: `
    <div class="container">
      <h1>Liste des utilisateurs</h1>
      <p>Permet de récupérer et de gérer les utilisateurs ({{ state().users.length }})</p>
      
      <div class="error" [class.active]="!!state().error">
        <div class="error-message">
          {{ state().error }}
        </div>
        <div class="error-retry">
          <button (click)="loadUsers(true)">Ressayer</button>
        </div>
      </div>

      <div class="user-list" (scroll)="onScroll($event)">
        @for (user of state().users; track user.id) {
          <div class="user-card">
            <div class="user-info">
              <h3>{{ user.name }}</h3>
              <p>{{ user.email }}</p>
            </div>
            <button (click)="openEditModal(user)">Éditer Profil</button>
          </div>
        }

        @if (state().loading) {
          @for (user of [1,2,3,4,5]; track user) {
            <div class="user-card loading">
              <div class="user-info">
                <h3></h3>
                <p></p>
              </div>
            </div>
          }
        }
      </div>

      @if (selectedUser()) {
        <app-user-modal
          [user]="selectedUser()!"
          (close)="closeModal()"
          (save)="saveUser($event)"
        />
      }
    </div>
  `,
  styles: [`
    .container {
      width:90%;
      margin: 0 auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      height:100%;
    }

    .user-list {
      overflow-y: scroll;
      height: 100%;
      position:relative;
      background:#ffffff40;
      backdrop-filter:blur(10px);
      box-shadow: 0 5px 10px #0000001a;
      border-radius: 5px;
    }

    .user-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      margin: 10px 15px;
      height:90px;
      border-bottom:1px solid rgba(0,0,0,0.1);
      &.loading{
        h3,p {
          border-radius: 4px;
          background-color: rgba(0,0,0,0.1);
          animation: placeholder 1.2s infinite ease-in-out;
        }
        h3 {
          width: 175px;
          height: 30px;
        }
        p{
          width: 200px;
          height: 15px;
        }
      }
    }

    .error {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding:0 20px;
      gap: 10px;
      border-radius: 5px;
      background:#ffffff40;
      backdrop-filter:blur(10px);
      box-shadow: 0 5px 10px #0000001a;
      visibility: hidden;
      transition: all 0.2s ease-in-out;
      opacity:0;
      &.active{
        margin:15px 0;
        padding: 10px 20px;
        visibility: visible;
        opacity:1;
      }
      .error-message {
        color: red;
        border-radius: 4px;
      }
    }

    .loading {
      text-align: center;
      padding: 20px;
    }

    button {
      padding: 8px 16px;
      background: rgba(0, 0, 0, 0.1);
      color: black;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      &:hover {
        background: white;
      }
    }
  `]
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  state = this.userService.getState();
  selectedUser = signal<User | null>(null);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(withRetry = false) {
    if (!this.state().loading && this.state().hasMore && (!this.state().error || withRetry)) {
      this.userService.loadUsers(this.state().page).subscribe();
    }
  }

  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const reachedBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 100;
    if (reachedBottom) {
      this.loadUsers();
    }
  }

  openEditModal(user: User) {
    this.selectedUser.set(user);
  }

  closeModal() {
    this.selectedUser.set(null);
  }

  saveUser(user: User) {
    this.userService.updateUser(user).subscribe({
      next: () => this.closeModal(),
      error: () => {
        alert('Une erreur est survenue lors de la mise à jour de l\'utilisateur');
      }
    });
  }
}