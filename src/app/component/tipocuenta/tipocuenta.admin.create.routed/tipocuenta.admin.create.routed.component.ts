import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ITipocuenta } from '../../../model/tipocuenta.interface';
import { TipoCuentaService } from '../../../service/tipoCuenta.service';

declare let bootstrap: any;

@Component({
  standalone: true,
  selector: 'app-tipocuenta-admin-create-routed',
  templateUrl: './tipocuenta.admin.create.routed.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  styleUrls: ['./tipocuenta.admin.create.routed.component.css'],
})

export class TipocuentaAdminCreateRoutedComponent implements OnInit {
  id: number = 0;
  oTipoCuentaForm: FormGroup | undefined = undefined;
  oTipoCuenta: ITipocuenta | null = null;
  strMessage: string = '';
  

  myModal: any;

  constructor(private oTipoCuentaService: TipoCuentaService, private oRouter: Router) {}

  ngOnInit() {
    this.createForm();
    this.oTipoCuentaForm?.markAllAsTouched();
  }

  createForm() {
    this.oTipoCuentaForm = new FormGroup({
      descripcion: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
      ]),
      creditoOdebito: new FormControl('', [
        Validators.required,
        Validators.pattern(''),
      ]),
      comentarios: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
      ]),
      realOnominal: new FormControl('', [
        Validators.required,
        Validators.pattern(''),
      ]),
    });
  }

  updateForm() {
    this.oTipoCuentaForm?.controls['descripcion'].setValue('');
    this.oTipoCuentaForm?.controls['creditoOdebito'].setValue('');
    this.oTipoCuentaForm?.controls['comentarios'].setValue('');
    this.oTipoCuentaForm?.controls['realOnominal'].setValue('');
  }

  showModal(mensaje: string) {
    this.strMessage = mensaje;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
      keyboard: false,
    });
    this.myModal.show();
  }

  onReset() {
    this.updateForm();
    return false;
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/admin/tipoCuenta/view/' + this.oTipoCuenta?.id]);
  };

  onSubmit() {
    
    if (this.oTipoCuentaForm?.invalid) {
      this.showModal('Formulario inválido');
      return;
    } else {
      this.oTipoCuentaService.create(this.oTipoCuentaForm?.value).subscribe({
        next: (oTipoCuenta: ITipocuenta) => {
          this.oTipoCuenta = oTipoCuenta;
          this.showModal('TipoCuenta creado con el id: ' + this.oTipoCuenta.id);
        },
        error: (err) => {
          this.showModal('Error al crear el TipoCuenta');
          console.log(err);
        },
      });
    }
  }
}
