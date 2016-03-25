function removeAllChildren(container)
{
    while (container && container.hasChildNodes())
    {
        container.removeChild(container.lastChild)
    }
}
