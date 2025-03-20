export const useChatScroll = (container: Ref<HTMLElement | null>) => {
    const scrollPosition = ref(0)

    const updateScrollPosition = () => {
        if (container.value) {
            scrollPosition.value = container.value.scrollTop
        }
    }

    const scrollToBottom = (behavior: ScrollBehavior | undefined = "smooth") => {
        nextTick(() => {
            if (container.value) {
                console.log("container dom exists. Scrolling.")
                container.value.scrollTo({
                    top: container.value.scrollHeight,
                    behavior: behavior,
                })
            }
        })
    }

    return { scrollPosition, updateScrollPosition, scrollToBottom }
}