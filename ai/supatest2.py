from config import supabase


response = (
    supabase
    .table("found_items")
    .select("keywords")
    .cs("keywords", ["earbud"])
    .execute()
)



print(response)