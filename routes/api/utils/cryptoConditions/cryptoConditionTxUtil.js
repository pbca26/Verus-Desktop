const extractReserveTransfers = (txJson) => {
  let transfers = []

  txJson.vout.map(output => {
    if (output.scriptPubKey.type === 'cryptocondition' && output.scriptPubKey["reservetransfer"] != null) {
      transfers.push(output.scriptPubKey.reservetransfer)
    }
  })
  
  return transfers;
}

module.exports = { extractReserveTransfers }