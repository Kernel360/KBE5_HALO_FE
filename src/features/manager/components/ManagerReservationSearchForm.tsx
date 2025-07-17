import {
  SearchForm,
  type SearchField
} from '../../../shared/components/SearchForm'

interface SearchFormData extends Record<string, string> {
  customerNameKeyword: string
  customerAddressKeyword: string
}

type SearchFormValue = string | string[]

interface ManagerReservationSearchFormProps {
  formData: SearchFormData
  onFormDataChange: (
    key: 'customerNameKeyword' | 'customerAddressKeyword',
    value: SearchFormValue
  ) => void
  onSearch: (keyword?: string, searchType?: string) => void
  className?: string
}

export const ManagerReservationSearchForm = ({
  formData,
  onFormDataChange,
  onSearch,
  className = ''
}: ManagerReservationSearchFormProps) => {
  const fields: SearchField[] = [
    {
      type: 'select',
      name: 'searchType',
      options: [
        { value: 'customerName', label: '고객명' },
        { value: 'customerAddress', label: '고객 주소' }
      ]
    },
    {
      type: 'text',
      name: 'searchKeyword',
      placeholder: '검색어'
    }
  ]

  const handleSearch = (values: Record<string, string>) => {
    const searchType = values.searchType || 'customerName'
    const keyword = values.searchKeyword || ''
    if (searchType === 'customerName') {
      onFormDataChange('customerNameKeyword', keyword)
      onSearch(keyword, 'customerName')
    } else if (searchType === 'customerAddress') {
      onFormDataChange('customerAddressKeyword', keyword)
      onSearch(keyword, 'customerAddress')
    }
  }

  return (
    <SearchForm
      fields={fields}
      onSearch={handleSearch}
      initialValues={{
        searchType: 'customerName',
        customerNameKeyword:
          formData.customerNameKeyword || formData.customerAddressKeyword
      }}
      showTitle={false}
      className={className}
    />
  )
}

export default ManagerReservationSearchForm
