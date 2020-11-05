// import React from 'react'
// import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions'
// import Table from './Table'
// import TableActions from './TableActions'
// import { CheckColumn, LinkColumn, Column, BooleanColumn } from './columns'

// const rows = [
//   { id: '1', name: 'Bob Marley', other: true, color: 'Blue', number: 1 },
//   { id: '2', name: 'Peter Tosh', other: true, color: 'Red', number: 3 },
//   { id: '3', name: 'Gregory Isaacs', other: false, color: 'Yellow', number: -1 },
//   { id: '4', name: 'Jimmy Cliff', other: false, color: 'Orange', number: -10 },
//   { id: '5', name: 'Burning Spear', other: true, color: 'Green', number: 0 },
//   { id: '6', name: 'Tanya Stephens', other: false, color: 'Purple', number: 15 },
// ]

// const rowsWithProps = [
//   {...rows[0] },
//   {...rows[1], props: { positive: true } },
//   {...rows[2], props: { negative: true } },
//   {...rows[3], props: { warning: true } },
//   {...rows[4], props: { disabled: true } },
//   {...rows[5], props: { active: true } },
// ]

// storiesOf('Table', module)
//   .addDecorator(story => (
//     <div>
//       {story()}
//     </div>
//   ))
//   .add('Basic', () => (
//     <Table rows={rows}>
//       <LinkColumn key='name' name='Name' onClick={action('click')} />
//       <BooleanColumn key='other' name='Other' />
//       <Column key='color' name='Colour' />
//       <Column key='number' name='Number' />
//     </Table>
//   ))
//   .add('With Props', () => (
//     <Table rows={rowsWithProps}>
//       <LinkColumn key='name' name='Name' onClick={action('click')} />
//       <BooleanColumn key='other' name='Other' />
//       <Column key='color' name='Colour' />
//       <Column key='number' name='Number' />
//     </Table>
//   ))
//   .add('Selectable', () => (
//     <Table rows={rows} selectable>
//       <CheckColumn key='selected' onChange={action('selected')} />
//       <LinkColumn key='name' name='Name' onClick={action('click')} />
//       <BooleanColumn key='other' name='Other' />
//       <Column key='color' name='Colour' />
//       <Column key='number' name='Number' />
//     </Table>
//   ))
//   .add('With Search', () => (
//     <Table rows={rows} showSearch>
//       <LinkColumn key='name' name='Name' onClick={action('click')} />
//       <BooleanColumn key='other' name='Other' />
//       <Column key='color' name='Colour' />
//       <Column key='number' name='Number' />
//     </Table>
//   ))
//   .add('With Toolbar', () => (
//     <Table rows={rows} showSearch>
//       <LinkColumn key='name' name='Name' onClick={action('click')} />
//       <BooleanColumn key='other' name='Other' />
//       <Column key='color' name='Colour' />
//       <Column key='number' name='Number' />
//       <TableActions>
//         <div>
//           <button primary>Click me </button>
//           <button>Click me 2</button>
//         </div>
//       </TableActions>
//     </Table>
//   ))
//   .add('Loading', () => (
//     <Table rows={rows} loading>
//       <LinkColumn key='name' name='Name' onClick={action('click')} />
//       <BooleanColumn key='other' name='Other' />
//       <Column key='color' name='Colour' />
//       <Column key='number' name='Number' />
//     </Table>
//   ))
