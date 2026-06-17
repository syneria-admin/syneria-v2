import { useConfigStore } from '../store/useConfigStore';

const CAD_CONVERSION = 0.044; // Facteur de conversion de ton ancien code

export const usePriceCalculator = () => {
  const { modelSpecs, options } = useConfigStore();

  const calculate = () => {
    // Si on n'a pas encore de fichier ou de specs générées, le prix est 0
    if (!modelSpecs || !options.materialId) return 0;

    const volCm3 = modelSpecs.volume / 1000;
    
    // Valeurs par défaut simplifiées pour l'initialisation
    const materialBasePrice = 1.2; 
    const finishFactor = options.finishId === 'fine' ? 1.45 : 1.0;
    const infillFactor = options.infill / 50; 

    const basePrice = Math.max(materialBasePrice * 1000, volCm3 * materialBasePrice * 35);
    const finalPrice = Math.round(basePrice * finishFactor * infillFactor * CAD_CONVERSION);

    return finalPrice;
  };

  return { totalPrice: calculate() };
};