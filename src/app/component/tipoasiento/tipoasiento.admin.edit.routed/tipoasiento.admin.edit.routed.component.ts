import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ITipoasiento } from '../../../model/tipoasiento.interface';
import { TipoAsientoService } from '../../../service/tipoAsiento.service';


declare let bootstrap: any;

@Component({
  selector: 'app-tipoasiento-admin-edit-routed',
  templateUrl: './tipoasiento.admin.edit.routed.component.html',
  styleUrls: ['./tipoasiento.admin.edit.routed.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class TipoasientoAdminEditRoutedComponent implements OnInit {
  id: number = 0;
  oTipoAsientoForm: FormGroup | undefined = undefined;
  oTipoAsiento: ITipoasiento | null = null;
  message: string = '';
  myModal: any;

  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oTipoAsientoService: TipoAsientoService,
    private oRouter: Router
  ) {
    this.oActivatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
    this.createForm();
    this.get();
    this.oTipoAsientoForm?.markAllAsTouched();
  }

  createForm() {
    this.oTipoAsientoForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
      ]),
     
    });
  }
  onReset() {
    this.oTipoAsientoService.get(this.id).subscribe({
      next: (oTipoAsiento: ITipoasiento) => {
        this.oTipoAsiento = oTipoAsiento;
        this.updateForm();
      },
      error: (error) => {
        console.error(error);
      },
    });
    return false;
  }

  updateForm() {
    this.oTipoAsientoForm?.controls['id'].setValue(this.oTipoAsiento?.id);
    this.oTipoAsientoForm?.controls['descripcion'].setValue(this.oTipoAsiento?.descripcion);
   
  }

  get() {
    this.oTipoAsientoService.get(this.id).subscribe({
      next: (oTipoAsiento: ITipoasiento) => {
        this.oTipoAsiento = oTipoAsiento;
        this.updateForm();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  showModal(mensaje: string) {
    this.message = mensaje;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
      keyboard: false,
    });
    this.myModal.show();
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/admin/tipoAsiento/view/' + this.oTipoAsiento?.id]);
  };

  onSubmit() {
    if (!this.oTipoAsientoForm?.valid) {
      this.showModal('Formulario no válido');
      return;
    } else {
      this.oTipoAsientoService.update(this.oTipoAsientoForm?.value).subscribe({
        next: (oTipoAsiento: ITipoasiento) => {
          this.oTipoAsiento = oTipoAsiento;
          this.updateForm();
          this.showModal('Tipo de Asiento ' + this.oTipoAsiento.id + ' actualizado');
        },
        error: (error) => {
          this.showModal('Error al actualizar el tipo de asiento');
          console.error(error);
        },
      });
    }
  }


}
