-- Allow each conversation participant to delete that conversation.
-- messages.conversation_id has ON DELETE CASCADE, so its message history is
-- removed atomically when the conversation row is deleted.

drop policy if exists "Participants can delete conversations" on public.conversations;

create policy "Participants can delete conversations"
on public.conversations for delete
using (auth.uid()::text = any(participants));