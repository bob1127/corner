async function getData() {
    const res = await fetch('https://ultraehp.com/next/data.json')


    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    return res.json()
}

export default async function Page() {
    const data = await getData()

    return <main></main>
}