crash_version="$(cat build_number).log"
until `npm start  >> $crash_version 2>&1`; 
do
	echo "Server 'myserver' crashed with exit code $?. Time: $(date). Respawning.." >> $crash_version
	sleep 1
done

