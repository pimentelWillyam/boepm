// tipos.ts

export type Batalhao =
  | "1º BPM" | "2º BPM" | "3º BPM" | "4º BPM" | "5º BPM"
  | "6º BPM" | "7º BPM" | "8º BPM" | "9º BPM" | "10º BPM"
  | "11º BPM" | "12º BPM" | "13º BPM" | "14º BPM" | "15º BPM"
  | "16º BPM" | "17º BPM" | "18º BPM" | "19º BPM" | "20º BPM"
  | "21º BPM" | "22º BPM" | "23º BPM" | "24º BPM" | "25º BPM"
  | "26º BPM"
  | "1ª CIPM" | "2ª CIPM" | "3ª CIPM" | "4ª CIPM"
  | "5ª CIPM" | "6ª CIPM" | "7ª CIPM" | "8ª CIPM"
  | "9ª CIPM" | "10ª CIPM" | "11ª CIPM"
  | "1º BPTRAN"
  | "1º BIESP" | "2º BIESP"
  | "BPA" | "BPCHOQUE" | "BPGD" | "BPRV" | "BPRP"
  | "BOPE" | "BPTUR" | "CIPCAES" | "CIPMOTO"
  | "BEPI" | "RPMON"
  | "SDS / CORREGEDORIA" | "SDS / GTA" | "SDS / LEI SECA"
  | "DASDH";

export type Diretoria = 'Dim' | 'Dinter 1' | 'Dinter 2' | 'Diresp';


// diretorias.ts

import { Batalhao } from './tipos';

export const DIM: readonly Batalhao[] = [
  '1º BPM', '6º BPM', '11º BPM', '12º BPM', '13º BPM',
  '16º BPM', '19º BPM', '20º BPM', '25º BPM', '26º BPM'
];

export const DINTER_1: readonly Batalhao[] = [
  '2º BPM', '4º BPM', '9º BPM', '10º BPM', '15º BPM',
  '21º BPM', '22º BPM', '24º BPM',
  '5ª CIPM', '6ª CIPM', '8ª CIPM'
];

export const DINTER_2: readonly Batalhao[] = [
  '3º BPM', '5º BPM', '7º BPM', '8º BPM', '14º BPM',
  '23º BPM',
  '1ª CIPM', '2ª CIPM', '3ª CIPM', '4ª CIPM'
];


// busca-diretoria-por-batalhao.ts

import { Batalhao, Diretoria } from './tipos';
import { DIM, DINTER_1, DINTER_2 } from './diretorias';

/**
 * Type guard para validar se a string é um Batalhão válido
 */
function isBatalhao(value: string): value is Batalhao {
  return (
    DIM.includes(value as Batalhao) ||
    DINTER_1.includes(value as Batalhao) ||
    DINTER_2.includes(value as Batalhao)
  );
}

export class BuscaDiretoriaPorBatalhao {
  static execute(codigoBatalhao?: string): Diretoria | null {
    if (!codigoBatalhao) return null;

    if (!isBatalhao(codigoBatalhao)) {
      return null;
    }

    if (DIM.includes(codigoBatalhao)) return 'Dim';
    if (DINTER_1.includes(codigoBatalhao)) return 'Dinter 1';
    if (DINTER_2.includes(codigoBatalhao)) return 'Dinter 2';

    return null;
  }
}
