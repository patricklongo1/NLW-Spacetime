import { ScrollView, TouchableOpacity, View, Text, Image } from 'react-native'
import Icon from '@expo/vector-icons/Feather'
/* import * as SecureStore from 'expo-secure-store' */

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { Link /* , useRouter */ } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'
import { api } from '../src/lib/api'
import * as SecureStore from 'expo-secure-store'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'

dayjs.locale(ptBr)

interface Memory {
  coverUrl: string
  excerpt: string
  createdAt: string
  id: string
  formattedDate?: string
}

export default function NewMemory() {
  const { bottom, top } = useSafeAreaInsets()
  const [memories, setMemories] = useState<Memory[]>([])

  /* const router = useRouter() */

  /* async function signOut() {
    await SecureStore.deleteItemAsync('token')

    router.push('/')
  } */

  useEffect(() => {
    async function loadMemories() {
      const token = await SecureStore.getItemAsync('token')
      try {
        const response = await api.get('/memories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        response.data.forEach((memory: Memory) => {
          memory.formattedDate = dayjs(memory.createdAt).format(
            'D[ de ]MMMM[, ]YYYY',
          )
        })

        setMemories(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    loadMemories()
  }, [])

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between">
        <NLWLogo />
        <View className="flex-row gap-2">
          <Link href="/new" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>

          {/* <TouchableOpacity
            onPress={signOut}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
          >
            <Icon name="log-out" size={16} color="#000" />
          </TouchableOpacity> */}
        </View>
      </View>

      <View className="mt-6 space-y-10">
        {memories.map((memory) => (
          <View key={memory.id} className="space-y-4 px-8">
            <View className="flex-row items-center gap-2">
              <View className="h-px w-5 bg-gray-50" />
              <Text className="text-center font-body text-xs text-gray-100">
                {memory.formattedDate}
              </Text>
            </View>
            <View className="space-y-4 px-8">
              <Image
                source={{
                  uri: memory.coverUrl,
                }}
                alt="coverImage"
                className="aspect-video w-full rounded-lg"
              />

              <Text className="font-body text-base leading-relaxed text-gray-100">
                {memory.excerpt}
              </Text>

              <Link href={`/memories/${memory.id}`} asChild>
                <TouchableOpacity className="flex-row items-center gap-2">
                  <Text className="font-body text-sm text-gray-100">
                    Ler mais
                  </Text>
                  <Icon name="arrow-right" size={16} color="#9e9ea0" />
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}
