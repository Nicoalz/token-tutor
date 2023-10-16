import axios from "axios";

const ape_address = "0x4d224452801aced8b2f0aebe155379bb5d594381";

const uniswap_subgraph_url =
  "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";

// Créez une fonction pour obtenir le prix du token
export async function getApePriceEth(): Promise<number | false> {
  try {
    // Effectuez une requête GET vers l'API Subgraph
    const response = await axios.post(uniswap_subgraph_url, {
      query: `
        {
          tokens(where: { id: "${ape_address}" }) {
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
