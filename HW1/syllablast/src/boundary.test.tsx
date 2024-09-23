import { expect, test } from 'vitest'
import Home, { selectOrDeselectSyllable, swapSyllable, undoSwap } from './app/page.tsx'
import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'

//BOUNDARY TEST.tsx
test('Home', async () => {
    const { getByText } = render(<Home />)
    const movesElement = getByText(/Number of Moves: 0/i);
  })