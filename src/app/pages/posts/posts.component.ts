import { Component, ViewChild, HostListener } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Post } from 'src/app/models/post';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { interval } from 'rxjs';
import { Notifications } from 'src/app/helpers/notifications';

@Component({
	selector: 'app-posts',
	templateUrl: './posts.component.html',
	styleUrls: ['./posts.component.css']
})
export class PostsComponent {
	dataSource = new MatTableDataSource<Post>();
	postColumns = [
		{
			key: 'id',
			type: 'number',
			label: '№'
		},
		{
			key: 'title',
			type: 'text',
			label: 'Название',
			required: true
		},
		{
			key: 'body',
			type: 'text',
			label: 'Содержание',
			required: true
		},
		{
			key: 'isEdit',
			type: 'isEdit',
			label: 'Действия'
		}
	];
	displayedColumns: string[] = this.postColumns.map((col) => col.key);
	columnsSchema: any = this.postColumns;
	errorMessage: string;
	reloadPageTimeout: number = 2*60*1000;
  
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(private apiService: ApiService, private notifications: Notifications) {}

	ngOnInit() {
		this.apiService.getPosts().subscribe({
			next: response => {
				this.dataSource.data = response;
				this.dataSource.paginator = this.paginator;
				this.notifications.showNotification('Список загружен успешно!', 'success');
			},
			error: error => {
				this.errorMessage = error.message;
				this.notifications.showNotification(this.errorMessage, 'error');
			}
		});
		this.reloadOnVisibility();
	}

	ngAfterViewInit() {
		this.paginator._intl.itemsPerPageLabel = 'Постов на странице:';
	}

	@HostListener('document:visibilitychange', ['$event'])
	reloadOnVisibility() {
		if (document.visibilityState == 'visible') { 
			interval(this.reloadPageTimeout).subscribe(() => { 
				this.reloadPage();
			});
		}
	}

	addRow() {
		const newPost: Post = {
			id: 0,
			title: '',
			body: '',
			userId: 11,
			isEdit: true
		};
		this.dataSource.data = [newPost, ...this.dataSource.data];
	}

	removeRow(id) {
		this.apiService.deletePost(id).subscribe({
			next: () => {
				this.dataSource.data = this.dataSource.data.filter((p: Post) => p.id !== id);
				this.notifications.showNotification('Пост удален успешно!', 'success');
			},
			error: error => {
				this.errorMessage = error.message;
				this.notifications.showNotification(this.errorMessage, 'error');
			}
		});
	}

	editRow(row) {
		row.isEdit = true;
	}

	saveRow(row) {
		if (row.title === '' || row.body === '') {
			this.notifications.showNotification('Поля "Название" и "Содержание" не должны быть пустыми!', 'error');
			return;
		}
	
		if (row.id === 0) {
			this.apiService.addPost(row).subscribe({
				next: (newPost: Post) => {
					row.id = newPost.id;
					row.isEdit = false;
					this.notifications.showNotification('Пост добавлен успешно!', 'success');
				},
				error: error => {
					this.errorMessage = error.message;
					this.notifications.showNotification(this.errorMessage, 'error');
				}
			});
		} else {
			this.apiService.updatePost(row).subscribe({
				next: () => {
					row.isEdit = false;
					this.notifications.showNotification('Пост сохранен успешно!', 'success');
				},
				error: error => {
					this.errorMessage = error.message;
					this.notifications.showNotification(this.errorMessage, 'error');
				}
			});
		}
	}

	applyfilter(event: Event) {
		const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
		this.dataSource.filter = value;
	}

	reloadPage() {
		window.location.reload();
	}
}
