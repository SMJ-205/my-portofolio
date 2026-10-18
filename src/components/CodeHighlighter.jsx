import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function CodeHighlighter(props) {
  return <SyntaxHighlighter style={atomDark} {...props} />
}
