import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ITipoasiento } from '../../../model/tipoasiento.interface';
import { TipoAsientoService } from '../../../service/tipoAsiento.service';


declare let bootstrap: any;

@Component({
  selector: 'app-tipoasiento-admin-delete-routed',standalone: true,
  imports: [RouterModule],
  templateUrl: './tipoasiento.admin.delete.routed.component.html',
  styleUrls: ['./tipoasiento.admin.delete.routed.component.css']
})
export class TipoasientoAdminDeleteRoutedComponent implements OnInit {
  oTipoAsiento: ITipoasiento | null = null;
  strMessage: string = '';
  myModal: any;

  constructor(
    private oTipoAsientoService: TipoAsientoService,
    private oActivatedRoute: ActivatedRoute,
    private oRouter: Router) { }

  ngOnInit(): void {
    let id = this.oActivatedRoute.snapshot.params['id'];
    this.oTipoAsientoService.get(id).subscribe({
      next: (oTipoAsiento: ITipoasiento) => {
        this.oTipoAsiento = oTipoAsiento;
      },
      error: (err) => {
        this.showModal('Error al cargar el Tipo de Asiento');
      },
    });
  }


  showModal(mensaje: string) {
    this.strMessage = mensaje;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
      keyboard: false,
    });
    this.myModal.show();
  }

  delete(): void {
    this.oTipoAsientoService.delete(this.oTipoAsiento!.id).subscribe({
      next: (data) => {
        this.showModal(
          'Tipo de Asiento con id ' + this.oTipoAsiento!.id + ' ha sido borrado'
        );
      },
      error: (error) => {
        this.showModal('Error al borrar el Tipo de Asiento');
      },
    });
  }

  cancel(): void {
    this.oRouter.navigate(['/admin/tipoAsiento/plist']);
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/admin/tipoAsiento/plist']);
  };
}
