import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay">
      <div class="modal">
        <h2>Editer le Profil</h2>
        
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Nom *</label>
            <input id="name" type="text" formControlName="name">
            @if (form.get('name')?.errors?.['required'] && form.get('name')?.touched) {
              <span class="error">Le nom est obligatoire</span>
            }
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input id="email" type="email" formControlName="email">
            @if (form.get('email')?.errors?.['required'] && form.get('email')?.touched) {
              <span class="error">L'email est obligatoire</span>
            }
            @if (form.get('email')?.errors?.['email'] && form.get('email')?.touched) {
              <span class="error">L'email est invalide</span>
            }
          </div>

          <div class="form-group">
            <label for="phone">Téléphone</label>
            <input id="phone" type="tel" formControlName="phone">
          </div>

          <div class="form-group">
            <label for="address">Adresse</label>
            <textarea id="address" formControlName="address"></textarea>
          </div>

          <div class="button-group">
            <button type="button" (click)="onClose()">Annuler</button>
            <button type="submit" [disabled]="!form.valid">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter:blur(7px);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .modal {
      background: rgba(255,255,255, .3);
      padding: 20px;
      border-radius: 4px;
      width: 400px;
      box-shadow: 0 5px 10px #0000001a;
      max-width: 90%;
      color:white;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
    }

    input, textarea {
      width: 100%;
      padding: 8px;
      border: none;
      outline: none;
      background: #ffffff2e;
      border-radius: 4px;
    }

    textarea {
      height: 100px;
    }

    .error {
      color: #ffffff;
      font-size: 12px;
      margin-top: 5px;
      background: #ff2243;
      padding: 4px 10px;
      border-radius: 5px;
      margin: 5px 0;
      display: block;
      width: fit-content;
    }

    .button-group {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }

    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button[type="submit"] {
      background: white;
    }

    button[type="button"] {
      background: transparent;
      color: white;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class UserModalComponent {
  @Input() user!: User;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<User>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['']
    });
  }

  ngOnInit() {
    this.form.patchValue(this.user);
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit({
        ...this.user,
        ...this.form.value
      });
    }
  }

  onClose() {
    this.close.emit();
  }
}