package quicksort

// Sort sorts the given integer slice using quicksort algorithm
func Sort(arr []int) {
	if len(arr) <= 1 {
		return
	}
	quickSort(arr, 0, len(arr)-1)
}

// quickSort performs the recursive quicksort
func quickSort(arr []int, low int, high int) {
	if low < high {
		pi := partition(arr, low, high)
		quickSort(arr, low, pi-1)
		quickSort(arr, pi+1, high)
	}
}

// partition partitions the array and returns the pivot index
func partition(arr []int, low int, high int) int {
	pivot := arr[high]
	i := low - 1

	for j := low; j < high; j++ {
		if arr[j] < pivot {
			i++
			arr[i], arr[j] = arr[j], arr[i]
		}
	}
	arr[i+1], arr[high] = arr[high], arr[i+1]
	return i + 1
}
