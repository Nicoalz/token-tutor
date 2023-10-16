import axios from "axios";

const ape_address = "0x4d224452801aced8b2f0aebe155379bb5d594381";
const usdc_address = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

const uniswap_subgraph_url =
  "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";

// Créez une fonction pour obtenir le prix du token
async function getTokenPriceEth(address: string): Promise<number | false> {
  try {
    // Effectuez une requête GET vers l'API Subgraph
    const response = await axios.post(uniswap_subgraph_url, {
      query: `
        {
          tokens(where: { id: "${address}" }) {
            id
            derivedETH
          }
        }
      `,
    });
    const tokenPriceInETH = response.data.data.tokens[0].derivedETH;
    return tokenPriceInETH as number;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const getApePrice = async (): Promise<number | false> => {
  const USDCPriceInEth = await getTokenPriceEth(usdc_address); // USDC vs ETH
  const APEPriceInEth = await getTokenPriceEth(ape_address); // APE vs ETH
  if (!USDCPriceInEth || !APEPriceInEth) return false;
  const ApePrice = APEPriceInEth / USDCPriceInEth; // APE / USDC
  return ApePrice;
};
