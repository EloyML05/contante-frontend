import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { ITipoasiento } from '../../../model/tipoasiento.interface';
import { TipoAsientoService } from '../../../service/tipoAsiento.service';

declare let bootstrap: any;

@Component({
  selector: 'app-tipoasiento-admin-create-routed',
  templateUrl: './tipoasiento.admin.create.routed.component.html',
  styleUrls: ['./tipoasiento.admin.create.routed.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class TipoasientoAdminCreateRoutedComponent implements OnInit {
  
  id: number = 0;
  oTipoAsientoForm: FormGroup | undefined = undefined;
  oTipoAsiento: ITipoasiento | null = null;
  strMessage: string = '';

  myModal: any;

  constructor(
    private oTipoAsientoService: TipoAsientoService,
    private oRouter: Router
  ) { }

  ngOnInit() {
    this.createForm();
    this.oTipoAsientoForm?.markAllAsTouched();
  }

  createForm() {
    this.oTipoAsientoForm = new FormGroup({
      descripcion: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
      ]),
    });
  }
  updateForm() {
    this.oTipoAsientoForm?.controls['descripcion'].setValue('');
    
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
    this.oRouter.navigate(['/admin/tipoAsiento/view/' + this.oTipoAsiento?.id]);
  };

  onSubmit() {
    if (this.oTipoAsientoForm?.invalid) {
      this.showModal('Formulario inválido');
      return;
    } else {      
      this.oTipoAsientoService.create(this.oTipoAsientoForm?.value).subscribe({
        next: (oTipoAsiento: ITipoasiento) => {
          this.oTipoAsiento = oTipoAsiento;
          this.showModal('Tipo de Asiento creado con el id: ' + this.oTipoAsiento.id);
        },
        error: (err) => {
          this.showModal('Error al crear el Tipo de Asiento');
          console.log(err);
        },
      });
    }
  }

}
