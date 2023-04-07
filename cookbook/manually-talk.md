# Manually Talk and Reply

What if you wanted to improve the user experience and its immersion?

For instance add contextualized responses from the bot that don't necessarily
need to interact with the backend. In the same manner, you could want to write
for the user himself as they click within a list of choices.

The functions described below are all implemented in
`src/components/Chatbox/Icon.tsx`. You can see the function signatures for more
help. They don't interact with the backend, so these actions don't survive
browser refreshes.

## Talk

Call the function `window.dydy.chat.ask`.

This function inserts content as if it were written or rather *asked* by the
user himself.

## Reply

Call the function `window.dydy.chat.reply`.

This function inserts content as if it were written or rather *replied* by the
chatbot itself.

## Reset

Call the function `window.dydy.chat.reset`.

This function empties the history of conversation.
