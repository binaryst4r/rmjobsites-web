import { payments, type Card } from '@square/web-sdk';

let squarePayments: any = null;
let card: Card | null = null;

export interface SquareConfig {
  application_id: string;
  location_id: string;
  environment: string;
}

export async function initializeSquarePayments(config: SquareConfig) {
  console.log('initializing square payments', config);
  if (!squarePayments) {
    squarePayments = await payments(config.application_id, config.location_id);
  }
  return squarePayments;
}

export async function initializeCard(containerId: string = 'card-container') {
  if (!squarePayments) {
    throw new Error('Square Payments must be initialized first');
  }

  card = await squarePayments.card();
  await card?.attach(`#${containerId}`);
  return card;
}

export async function tokenizeCard(): Promise<string> {
  if (!card) {
    throw new Error('Card must be initialized first');
  }

  const result = await card.tokenize();

  if (result.status === 'OK') {
    return result.token;
  } else {
    const errorMessages = 'errors' in result 
      ? result.errors.map(error => error.message).join(', ')
      : result.status;
    throw new Error(`Payment tokenization failed: ${errorMessages}`);
  }
}

export function destroyCard() {
  if (card) {
    card.destroy();
    card = null;
  }
}
