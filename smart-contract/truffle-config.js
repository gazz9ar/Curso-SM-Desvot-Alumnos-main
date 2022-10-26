/**
 * Utilice este archivo para configurar su proyecto de truffle. Está sembrado con algunos
 * configuraciones comunes para diferentes redes y características como las migraciones,
 * compilación y pruebas. Descomente los que necesite o modifique
 * que necesita o modificar para adaptarse a su proyecto como sea necesario.
 *
 * Se puede encontrar más información sobre la configuración en:
 *
 * https://trufflesuite.com/docs/truffle/reference/configuration
 *
 * Para desplegar a través de Infura necesitarás un proveedor de carteras (como @truffle/hdwallet-provider)
 * para firmar tus transacciones antes de enviarlas a un nodo público remoto. Las cuentas de Infura
 * están disponibles de forma gratuita en: infura.io/register.
 *
 * También necesitarás un mnemónico - la frase de doce palabras que el monedero utiliza para generar
 * pares de claves públicas/privadas. Si vas a publicar tu código en GitHub asegúrate de cargar esta
 * frase desde un archivo que hayas .gitignorado para que no se haga pública accidentalmente.
 *
 */

// require('dotenv').config();
// const mnemonic = process.env["MNEMONIC"];
// const infuraProjectId = process.env["INFURA_PROJECT_ID"];
 
// const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  /**
   * Las redes definen cómo te conectas a tu cliente ethereum y te permiten establecer los
   * predeterminados que web3 utiliza para enviar transacciones. Si no se especifica un truffle
   * creará una cadena de bloques de desarrollo para ti en el puerto 9545 cuando
   * cuando ejecutes `develop` o `test`. Puedes pedirle a un comando de truffle que use una red específica
   * red desde la línea de comandos, por ejemplo
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Útil para las pruebas. El nombre `development` es especial - truffle lo utiliza por defecto
    // si se define aquí y no se especifica ninguna otra red en la línea de comandos.
    // Debe ejecutar un cliente (como ganache, geth, o parity) en una terminal separada
    // si utiliza esta red y también debe establecer las opciones `host`, `port` y `network_id`
    // a algún valor.
    //
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "5777",       // Any network (default: none)
    },
    //
    // goerli: {
    //   provider: () => new HDWalletProvider(mnemonic, `https://goerli.infura.io/v3/${infuraProjectId}`),
    //   network_id: 5,       // Goerli's id
    //   chain_id: 5
    // }
  },

  // Establezca aquí las opciones predeterminadas de mocha, utilice reporteros especiales, etc.
  mocha: {
    // timeout: 100000
  },

  // Configurar los compiladores
  compilers: {
    solc: {
      version: "0.8.13",      // Fetch exact version from solc-bin
    }
  }
};
