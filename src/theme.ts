import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react"

// export const theme = extendTheme({
//   colors: {
//     // green: {
//     //   100: "#f7fafc",
//     //   500: "red",
//     //   900: "#1a202c",
//     // },
//   },
//   // The default size and variant values
//   defaultProps: {
//     size: 'md',
//     variant: 'green',
//   },
// });

export const theme = extendTheme(withDefaultColorScheme({ colorScheme: 'green' }))