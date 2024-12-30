import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, delay, map, throwError } from 'rxjs';
import { User, UserState } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'http://localhost:3000/users';
  private readonly PAGE_SIZE = 20;

  private state = signal<UserState>({
    users: [],
    loading: false,
    error: null,
    page: 0,
    hasMore: true
  });

  constructor(private http: HttpClient) {}

  getState() {
    return this.state.asReadonly();
  }

  loadUsers(page: number = 0): Observable<User[]> {
    this.state.update(s => ({ ...s, loading: true, error: null }));
    page = page === 0 ? 1 : this.state().page + 1;
    return this.http.get<User[]>(`${this.API_URL}?_page=${page}&_limit=${this.PAGE_SIZE}`).pipe(
      delay(page === 1 ? 500 : 500),
      map(users => {
        this.state.update(s => ({
          ...s,
          users: page === 1 ? users : [...s.users, ...users],
          loading: false,
          page,
          hasMore: users.length === this.PAGE_SIZE
        }));
        return users;
      }),
      catchError(this.handleError.bind(this))
    );
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/${user.id}`, user).pipe(
      map(updatedUser => {
        this.state.update(s => ({
          ...s,
          users: s.users.map(u => u.id === updatedUser.id ? updatedUser : u)
        }));
        return updatedUser;
      }),
    );
  }

  private handleError(error: HttpErrorResponse) {
    const errorMessage = error.error instanceof ErrorEvent ? `client` : `Code serveur : ${error.status}`;
    this.state.update(s => ({
      ...s,
      loading: false,
      error: `Une erreur est survenue lors de la récupération des utilisateurs - ${errorMessage}`
    }));

    return throwError(() => new Error(errorMessage));
  }
}