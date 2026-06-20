import Editor from "@monaco-editor/react";

type CodeEditorProps = {
	setValue: (value: string) => void;
	value: string | null;
	readOnly?: boolean;
}

const CodeEditor = (props: CodeEditorProps) => {
	const handleValueChange = (value: string) => {
		props.setValue(value);
	};

	return (
		<Editor
			height="550px"
			value={props.value ?? ""}
			onChange={handleValueChange }
			defaultLanguage="powershell"
			theme="vs-dark"
			options={{ readOnly: props.readOnly }}
		/>
	);
};

export default CodeEditor;
