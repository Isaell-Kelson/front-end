import {Component} from '@angular/core';
import {Router} from '@angular/router';
import axios from 'axios';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  name: string = '';
  status: boolean = true;
  role: string = 'user';
  isRegister: boolean = false;
  isSuccess: boolean = false;
  errors: string[] = [];

  constructor(private router: Router) {
  }

  toggleForm() {
    this.isRegister = !this.isRegister;
    this.isSuccess = false;
    this.errors = [];
  }

  validateFields(): boolean {
    this.errors = [];
    if (this.isRegister) {
      if (!this.name || !this.email || !this.password) {
        this.errors.push('Todos os campos são obrigatórios.');
        return false;
      }
    } else {
      if (!this.email || !this.password) {
        this.errors.push('Todos os campos são obrigatórios.');
        return false;
      }
    }
    return true;
  }

  async onLogin() {

    if (!this.validateFields()) return;

    try {
      const response = await axios.post('https://104.131.80.155/login', {
        email: this.email,
        password: this.password
      });

      // Acessando o token retornado pela API
      const token = response.data.access_token;
      if (token) {
        console.log('Token recebido:', token);
        // Armazenando o token no localStorage
        localStorage.setItem('token', token);
      }

      await this.router.navigate(['/home']);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Erro ao fazer login.';
        this.errors.push(errorMessage);
      } else {
        this.errors.push('Erro inesperado ao fazer login.');
      }
      console.error('Erro no login', error);
    }
  }


  async onRegister() {
    if (!this.validateFields()) return;

    try {
      const response = await axios.post('https://104.131.80.155/users/create', {
        name: this.name,
        email: this.email,
        password: this.password,
        status: this.status,
        role: this.role
      });
      console.log(response.data);
      this.isSuccess = true;


      this.name = '';
      this.email = '';
      this.password = '';
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          this.errors.push('O email já existe.');
        } else {
          const errorMessage = error.response?.data?.message || 'Erro ao cadastrar.';
          this.errors.push(errorMessage);
        }
      } else {
        this.errors.push('Erro inesperado ao cadastrar.');
      }
      console.error('Erro no cadastro', error);
    }
  }
}
