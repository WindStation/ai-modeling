export const useUmlGenerator = () => {
    const generate = async (umlCode: string) => {


        const response = await apiClient.uml.generateUml(umlCode)
        // 创建临时 URL
        const url = URL.createObjectURL(response)
        console.log(`Generated ${url}`)
        return url

    }

    return { generate }
}