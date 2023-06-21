#include <stdio.h>
#include <stdlib.h>
#include <glib.h>


int main(void){
    
    int array[6] = {153658, 661157, 5, 2489756, 254896, 23};

    GHashTable *table = g_hash_table_new_full (g_direct_hash, g_direct_equal, NULL, NULL);
    
    for (int i = 0; i < 6 ; i++){
        g_hash_table_insert (table, GINT_TO_POINTER (i), GINT_TO_POINTER (array[i]));
       
    }

    printf("primeiro: %d\n", &(g_hash_table_lookup(table, 0)));

    return 0;
}