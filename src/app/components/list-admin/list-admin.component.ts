import {Component, OnInit} from '@angular/core';
import axios from 'axios';
import {CommonModule, NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

interface UserProps {
  name: string;
  email: string;
  password: string;
  role: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  status: boolean;
}

@Component({
  selector: 'app-list-admin',
  standalone: true,
  templateUrl: './list-admin.component.html',
  imports: [
    CommonModule,
    NgForOf,
    NgClass,
    NgIf,
    FormsModule
  ],
  styleUrls: ['./list-admin.component.css']
})
export class ListAdminComponent implements OnInit {
  users: User[] = [];
  private _user: User | null = null;
  notification: { message: string; success: boolean } | null = null;
  editingUserId: string | null = null;

  constructor() {
  }

  async ngOnInit() {
    await this.fetchUsers();
  }

  // Método para obter o token do localStorage
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  async fetchUsers() {
    try {
      const token = this.getToken();
      const response = await axios.get('http://104.131.80.155/users/list', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      this.users = response.data.map((user: { _id: string; props: UserProps }) => ({
        id: user._id,
        name: user.props.name,
        email: user.props.email,
        status: user.props.status,
      }));

      console.log('Usuários processados:', this.users);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      this.notification = {message: 'Você não é um administrador', success: false};
    }
  }

  editUser(user: User) {
    this.editingUserId = user.id;
  }

  async saveUser(user: User) {
    try {
      const token = this.getToken();
      await axios.put(`http://104.131.80.155/users/${user.id}`, user, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      this.notification = {message: 'Usuário atualizado com sucesso.', success: true};
      this.editingUserId = null;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      this.notification = {message: 'Erro ao atualizar usuário', success: false};
    }
  }

  async toggleUserStatus(user: User) {
    try {
      const updatedStatus = !user.status;
      const token = this.getToken();
      await axios.put(`http://104.131.80.155/users/${user.id}`, {status: updatedStatus}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      user.status = updatedStatus;
      this.notification = {message: 'Status do usuário atualizado com sucesso.', success: true};
    } catch (error) {
      console.error('Erro ao atualizar o status do usuário:', error);
      this.notification = {message: 'Erro ao atualizar o status do usuário', success: false};
    }
  }

  async deleteUser(id: string) {
    try {
      const token = this.getToken();
      await axios.delete(`http://104.131.80.155/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      this.users = this.users.filter(user => user.id !== id);
      this.notification = {message: 'Usuário excluído com sucesso.', success: true};
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      this.notification = {message: 'Erro ao excluir usuário', success: false};
    }
  }
}
