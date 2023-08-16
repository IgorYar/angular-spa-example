import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Post } from '../models/post';

@Injectable({providedIn: 'root'})
export class ApiService {
    private apiUrl = 'https://jsonplaceholder.typicode.com'

    constructor(private http: HttpClient) {}

    registerUser(user: User): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/users`, user);
    }

    getPosts(): Observable<Post[]> {
        return this.http.get<Post[]>(`${this.apiUrl}/posts`);
    }

    addPost(post: Post): Observable<Post> {
        return this.http.post<Post>(`${this.apiUrl}/posts`, post);
    }

    deletePost(id: number): Observable<Post> {
        return this.http.delete<Post>(`${this.apiUrl}/posts/${id}`)
    }

    updatePost(post: Post): Observable<Post> {
        return this.http.patch<Post>(`${this.apiUrl}/posts/${post.id}`, post)
    }
}