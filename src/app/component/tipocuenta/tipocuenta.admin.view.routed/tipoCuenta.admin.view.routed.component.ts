import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITipocuenta } from '../../../model/tipocuenta.interface';
import { TipoCuentaService } from '../../../service/tipoCuenta.service';

@Component({
  selector: 'app-tipoCuenta.admin.view.routed',
  templateUrl: './tipoCuenta.admin.view.routed.component.html',
  styleUrls: ['./tipoCuenta.admin.view.routed.component.css'],
})
export class TipoCuentaAdminViewRoutedComponent implements OnInit {
  id: number = 0;
  route: string = '';
  oTipoCuenta: ITipocuenta = {} as ITipocuenta;
  
  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oTipoCuentaService: TipoCuentaService
  ) {}

  ngOnInit() {
    this.id = this.oActivatedRoute.snapshot.params['id'];
    this.getOne();
  }
getOne() {
    this.oTipoCuentaService.getOne(this.id).subscribe({
      next: (data: ITipocuenta) => {
        this.oTipoCuenta = data;
      },
    });
  }
}
