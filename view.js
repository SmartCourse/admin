class TableView {
    constructor() {
        this.$root = document.querySelector('tbody')
    }

    renderTable(data) {
        this.$root.innerHTML = null
        this.$root.append(
            ...data.map(this.createRow.bind(this))
        )
    }

    createRow(rowData, id) {
        const { numReports, parentType, title, link, body, apiLink } = rowData

        const row = document.createElement('tr')
        row.setAttribute('data-row', id)
        row.setAttribute('data-location', apiLink)

        const checkbox = document.createElement('input')
        checkbox.setAttribute('type', 'checkbox')
        checkbox.setAttribute('data-delete', id)
        const checkColumn = document.createElement('td')
        checkColumn.appendChild(checkbox)

        const numberColumns = [
            numReports, parentType
        ]
            .map((text) => {
                const $el = document.createElement('td')
                $el.textContent = text
                return $el
            })
        const textRows = [
            title,
            body
        ]
            .map(() => document.createElement('td'))
            .map($el => {
                $el.className = 'text-row'
                return $el
            })

        textRows[0].innerHTML = `<a href='${link}' target='_blank'>${title}</a>`
        textRows[1].textContent = body

        row.append(
            checkColumn,
            ...numberColumns,
            ...textRows
        )

        return row
    }
}

export default TableView