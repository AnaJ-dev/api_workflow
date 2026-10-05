process.loadEnvFile()

const saveBankAPI = process.env.bankAPIurl
const saveAPIkey = process.env.APIbearerKey
const currency = process.env.currencyPair

let allTransactions
let currencyConverter
let saveCurrency
let saveDate
let ntfyFetch


try {
    allTransactions = await fetch(`${saveBankAPI}/transactions`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${saveAPIkey}`
        }
    })


}
catch (error) {
    throw new Error(`server error: ${error}`)
}
if (allTransactions.status !== 200) {
    throw new Error(`Error fetching transactions. Status ${allTransactions.status}: ${allTransactions.statusText}`)
}

const allTransactionResult = await allTransactions.json()

for (const el of allTransactionResult) {
    if (el.amount <= 0) {
        console.log('Debit transaction', el.amount, el.currency)

        saveCurrency = el.currency
        saveDate = el.date

        try {
            currencyConverter = await fetch(`${currency}rate/${saveCurrency}/gbp?date=${saveDate}`, {
                method: "GET"

            })
        }



        catch (error) {
            throw new Error(`currency - server error: ${error}`)

        }

        const targetCurrency = await currencyConverter.json()


        const saveRate = targetCurrency.rate


        const amountinGBP = saveRate * el.amount
        if (amountinGBP < -15) {
            console.log('Transaction is above treshold:', amountinGBP)
            //https://docs.ntfy.sh/publish/
            try {
                ntfyFetch = await fetch('https://ntfy.sh/faexw', {
                    method: 'POST',
                    body: `Transaction #${el.id} of ${el.amount * -1} ${saveCurrency} which is less than threshold of 15GBP`,
                    headers: {
                        'Title': 'Alert',
                        'Priority': 'urgent',
                    }
                })
            }
            catch (error) {
                throw new Error(`Server error on ntfy ${error}`)
            }

            if (ntfyFetch.status !== 200) {
                throw new Error(`Error fetching ntfy. Status ${ntfyFetch.status}: ${ntfyFetch.statusText}`)

            }

        }

    }




}


