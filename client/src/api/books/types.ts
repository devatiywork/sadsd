import { Card } from '@/types/card.types'

// Если API возвращает массив карточек напрямую
export type CardsResponse = Card[]

// Если API возвращает объект с полем data, содержащим массив карточек
// export interface CardsResponse {
//   data: Card[];
// }
