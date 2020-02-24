import { Component, OnInit } from '@angular/core';

import { GameService } from '../../services/game.service';
import { Game } from '../../interfaces/interfaces';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-goty',
  templateUrl: './goty.component.html',
  styleUrls: ['./goty.component.css']
})
export class GotyComponent implements OnInit {

  constructor(private gameService: GameService) { }

  juegos: Game[] = [];

  ngOnInit(): void {
    this.gameService.getNominados()
      .subscribe(resGames => {
        this.juegos = resGames;
      });
  }

  votarJuego(juego: Game) {
    this.gameService.votarJuegos(juego.id)
      .subscribe((res: any) => {
        if (res.ok) {
          Swal.fire('Gracias', res.message, 'success');
        } else {
          Swal.fire('Ups', res.message, 'error');
        }
      });
  }

}
