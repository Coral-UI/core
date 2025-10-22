import { convertFormValuesToCoralStyles, convertCoralStylesToFormValues } from '../convertFormToCoralStyles'

describe('convertFormValuesToCoralStyles', () => {
  const defaultValues = {
    fontSize: '',
    fontSizeUnit: 'px',
    padding: '',
    paddingUnit: 'px',
    width: '',
    widthUnit: 'px',
  }

  it('should convert fontSize with px unit to plain number', () => {
    const formValues = {
      fontSize: 16,
      fontSizeUnit: 'px',
    }

    const result = convertFormValuesToCoralStyles(formValues, defaultValues)

    expect(result).toEqual({
      fontSize: 16,
    })
  })

  it('should convert fontSize with rem unit to dimension object', () => {
    const formValues = {
      fontSize: 1.5,
      fontSizeUnit: 'rem',
    }

    const result = convertFormValuesToCoralStyles(formValues, defaultValues)

    expect(result).toEqual({
      fontSize: { value: 1.5, unit: 'rem' },
    })
  })

  it('should convert fontSize with em unit to dimension object', () => {
    const formValues = {
      fontSize: 2,
      fontSizeUnit: 'em',
    }

    const result = convertFormValuesToCoralStyles(formValues, defaultValues)

    expect(result).toEqual({
      fontSize: { value: 2, unit: 'em' },
    })
  })

  it('should handle multiple dimensions with different units', () => {
    const formValues = {
      fontSize: 1.5,
      fontSizeUnit: 'rem',
      padding: 20,
      paddingUnit: 'px',
      width: 100,
      widthUnit: '%',
    }

    const result = convertFormValuesToCoralStyles(formValues, defaultValues)

    expect(result).toEqual({
      fontSize: { value: 1.5, unit: 'rem' },
      padding: 20, // px returns plain number
      width: { value: 100, unit: '%' },
    })
  })

  it('should skip empty values', () => {
    const formValues = {
      fontSize: '',
      fontSizeUnit: 'rem',
      padding: 20,
      paddingUnit: 'px',
    }

    const result = convertFormValuesToCoralStyles(formValues, defaultValues)

    expect(result).toEqual({
      padding: 20,
    })
  })

  it('should default to px when no unit specified', () => {
    const formValues = {
      fontSize: 16,
      // fontSizeUnit is missing
    }

    const result = convertFormValuesToCoralStyles(formValues, defaultValues)

    expect(result).toEqual({
      fontSize: 16,
    })
  })
})

describe('convertCoralStylesToFormValues', () => {
  it('should convert plain number to value with px unit', () => {
    const coralStyles = {
      fontSize: 16,
    }

    const result = convertCoralStylesToFormValues(coralStyles)

    expect(result).toEqual({
      fontSize: 16,
      fontSizeUnit: 'px',
    })
  })

  it('should split dimension object into value and unit', () => {
    const coralStyles = {
      fontSize: { value: 1.5, unit: 'rem' },
    }

    const result = convertCoralStylesToFormValues(coralStyles)

    expect(result).toEqual({
      fontSize: 1.5,
      fontSizeUnit: 'rem',
    })
  })

  it('should handle multiple dimensions', () => {
    const coralStyles = {
      fontSize: { value: 1.5, unit: 'rem' },
      padding: 20,
      width: { value: 100, unit: '%' },
    }

    const result = convertCoralStylesToFormValues(coralStyles)

    expect(result).toEqual({
      fontSize: 1.5,
      fontSizeUnit: 'rem',
      padding: 20,
      paddingUnit: 'px',
      width: 100,
      widthUnit: '%',
    })
  })

  it('should handle non-dimension properties', () => {
    const coralStyles = {
      fontSize: 16,
      color: '#333',
      display: 'flex',
    }

    const result = convertCoralStylesToFormValues(coralStyles)

    expect(result).toEqual({
      fontSize: 16,
      fontSizeUnit: 'px',
      color: '#333',
      display: 'flex',
    })
  })
})
