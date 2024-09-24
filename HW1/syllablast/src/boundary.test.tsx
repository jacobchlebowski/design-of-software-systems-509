import { expect, test } from 'vitest'
import Home from './app/page.tsx'
import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'

//BOUNDARY TEST.tsx
test('Home', async () => {
    const { getByTestId } = render(<Home />)
    const swapButton = getByTestId('swapbutton')
    const resetButton = getByTestId('resetbutton')
    const undoButton = getByTestId('undobutton')
    const configuration1button = getByTestId('configuration1button')
    const configuration2button = getByTestId('configuration2button')
    const configuration3button = getByTestId('configuration3button')

    expect(swapButton.disabled).toBeTruthy()
    expect(resetButton.disabled).toBeTruthy()
    expect(undoButton.disabled).toBeTruthy()
    expect(configuration1button.disabled).toBeFalsy()
    expect(configuration2button.disabled).toBeFalsy()
    expect(configuration2button.disabled).toBeFalsy()
    
  })