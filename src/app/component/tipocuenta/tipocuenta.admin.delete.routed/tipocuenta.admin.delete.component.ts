import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ITipocuenta } from '../../../model/tipocuenta.interface';
import { TipoCuentaService } from '../../../service/tipoCuenta.service';

declare let bootstrap: any;

@Component({
  selector: 'app-tipocuenta-admin-delete-routed',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './tipocuenta.admin.delete.component.html',
  styleUrl: './tipocuenta.admin.delete.component.css',
})
export class TipocuentaAdminDeleteRoutedComponent implements OnInit {
  oTipoCuenta: ITipocuenta
  strMessage: string = '';
  myModal: any;

  constructor(
    private oTipoCuentaService: TipoCuentaService,
    private oActivatedRoute: ActivatedRoute,
    private oRouter: Router
  ) {
    this.oTipoCuenta = {} as ITipocuenta;
  }

  ngOnInit(): void {
    let id = this.oActivatedRoute.snapshot.params['id'];
    this.oTipoCuentaService.get(id).subscribe({
      next: (oTipoCuenta: ITipocuenta) => {
        this.oTipoCuenta = oTipoCuenta;
      },
      error: (err) => {
        this.showModal('Error al cargar el TipoCuenta');
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
    this.oTipoCuentaService.delete(this.oTipoCuenta!.id).subscribe({
      next: (data) => {
        this.showModal(
          'TipoCuenta con id ' + this.oTipoCuenta!.id + ' ha sido borrado'
        );
      },
      error: (error) => {
        this.showModal('Error al borrar el TipoCuenta');
      },
    });
  }

  cancel(): void {
    this.oRouter.navigate(['/admin/tipoCuenta/plist']);
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/admin/tipoCuenta/plist']);
  };
}
